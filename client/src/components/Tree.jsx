import React from "react";

const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
    const isDir = !!nodes;
    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                if (isDir) return;
                onSelect(path);
            }}
            style={{ marginLeft: "10px" }}
        >
            <p className={!isDir ? "file-node" : ""}>{fileName}</p>
            {nodes && fileName !== 'node_modules' && (
                <ul>
                    {Object.keys(nodes).map((key) => {
                        return (
                            <li key={key}>
                                <FileTreeNode
                                    fileName={key}
                                    path={path + "/" + key}
                                    onSelect={onSelect}
                                    nodes={nodes[key]}
                                />
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

const FileTree = ({ tree, onSelect }) => {
    return <FileTreeNode fileName="/" path="" onSelect={onSelect} nodes={tree} />;
};

export default FileTree;
