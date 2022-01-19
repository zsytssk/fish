/* eslint-disable @typescript-eslint/no-explicit-any */
import * as path from 'path';
import * as ts from 'typescript';

import { exists, readFile } from '../zutil/ls/asyncUtil';
import { write } from '../zutil/ls/write';
import { RawData } from './csvUtils';
import {
    findNodeValue,
    findValueNode,
    getNodeName,
    replaceRange,
} from './utils';

type Range = [number, number];
type NameMap = string;
export class FileNode {
    private rel_map: Map<string, FileNode> = new Map();
    private source_file: ts.SourceFile;
    private source: string;
    constructor(private file_path: string) {}
    public async findTargetNode(name_path: NameMap[]) {
        if (!this.source_file) {
            const filename = path.basename(this.file_path);
            const source = await readFile(this.file_path);
            this.source_file = ts.createSourceFile(
                filename,
                source,
                ts.ScriptTarget.Latest,
            );

            this.source = source;
        }

        return this.innerFindTargetNode(name_path, this.source_file.statements);
    }
    public async replaceData(data: RawData) {
        const task_arr = [] as {
            node: ts.Node;
            str: string;
            key_arr: string[];
        }[];
        for (const [key, val] of Object.entries(data)) {
            for (const item of val) {
                const key_arr = ['International', item.lang, key];
                const target_node = await this.findTargetNode(key_arr);
                if (!target_node) {
                    console.error(`cant find node for ${key_arr}`);
                    continue;
                }
                const node = findValueNode(target_node);
                task_arr.push({ node, str: item.str, key_arr });
            }
        }

        task_arr.sort((a, b) => b.node.pos - a.node.pos);

        let { source } = this;
        task_arr.map((item) => {
            const range: Range = [item.node.pos, item.node.end];
            source = replaceRange(source, range, ` '${item.str}'`);
        });
        await write(this.file_path, source);
    }
    private async innerFindTargetNode(
        name_path: NameMap[],
        statements: ts.NodeArray<ts.Node>,
    ): Promise<ts.Node> {
        const [first, ...rest] = [...name_path];
        let node = await this.findMatchNode(first, statements);

        if (!first || !node) {
            return null;
        }

        if (!rest.length) {
            return node;
        }

        node = findValueNode(node);

        if (ts.isEnumDeclaration(node)) {
            return this.innerFindTargetNode(rest, node.members);
        }
        if (ts.isObjectLiteralExpression(node)) {
            return this.innerFindTargetNode(rest, node.properties);
        }
        if (ts.isImportDeclaration(node)) {
            let file_path = (node.moduleSpecifier as any).text;
            const dir_name = path.dirname(this.file_path);
            file_path = path.resolve(dir_name, file_path + '.ts');
            if (!exists(file_path)) {
                return;
            }
            let target_file_node = this.rel_map.get(file_path);
            if (!target_file_node) {
                target_file_node = new FileNode(file_path);
                this.rel_map.set(file_path, target_file_node);
            }
            const val = await target_file_node.findTargetNode(name_path);
            return val;
        }
    }
    private async findMatchNode(
        name: NameMap,
        statements: ts.NodeArray<ts.Node>,
    ): Promise<ts.Node | null> {
        for (const item of statements) {
            if (ts.SyntaxKind[item.kind] === 'FirstStatement') {
                const findItem = await this.findMatchNode(
                    name,
                    (item as any).declarationList.declarations,
                );
                if (findItem) {
                    return findItem;
                }
            } else if (ts.isImportDeclaration(item)) {
                if (await this.matchNodeValue(item.importClause, name as any)) {
                    return item;
                }
                if (
                    await this.matchNodeValue(
                        item.importClause?.namedBindings,
                        name as any,
                    )
                ) {
                    return item;
                }

                const elements =
                    (item.importClause?.namedBindings as any)?.elements || [];
                for (const element of elements) {
                    if (await this.matchNodeValue(element, name as any)) {
                        return item;
                    }
                }
            } else {
                if (await this.matchNodeValue(item, name as any)) {
                    return item;
                }
            }
        }

        return null;
    }

    private async matchNodeValue(
        node: ts.Node,
        name: string,
    ): Promise<boolean> {
        const node_name = getNodeName(node);

        if (!node_name) {
            return false;
        }
        if (typeof node_name === 'string') {
            return name === node_name;
        }

        const node_value = await this.innerFindTargetNode(
            node_name,
            this.source_file.statements,
        );

        return name === findNodeValue(node_value);
    }
}
