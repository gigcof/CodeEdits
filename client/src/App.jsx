import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Terminal from "./components/Terminal";
import FileTree from "./components/Tree";
import socket from "./socket";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import { getFileMode } from "./utils/getFileMode";
function App() {
    const [fileTree, setFileTree] = useState({});
    const [selectedFile, setSelectedFile] = useState("");
    const [selectedFileContent, setSelectedFileContent] = useState("");
    const [code, setCode] = useState("");

    const isSaved = selectedFileContent === code;

    useEffect(() => {
        if (!isSaved && code) {
            const timer = setTimeout(() => {
                socket.emit("file:change", {
                    path: selectedFile,
                    content: code,
                });
            }, 5 * 1000);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [code, selectedFile, isSaved]);

    useEffect(() => {
        setCode("");
    }, [selectedFile]);

    useEffect(() => {
        setCode(selectedFileContent);
    }, [selectedFileContent]);

    const getFileTree = async () => {
        const response = await fetch("http://localhost:9000/files");
        const result = await response.json();
        setFileTree(result.tree);
    };

    const getFileContents = useCallback(async () => {
        if (!selectedFile) return;
        const response = await fetch(
            `http://localhost:9000/files/content?path=${selectedFile}`
        );
        const result = await response.json();
        setSelectedFileContent(result.content);
    }, [selectedFile]);

    useEffect(() => {
        if (selectedFile) getFileContents();
    }, [getFileContents, selectedFile]);

    useEffect(() => {
        socket.on("file:refresh", getFileTree);
        return () => {
            socket.off("file:refresh", getFileTree);
        };
    }, []);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <div className="files" style={{ flex: "0 0 auto", width: "25%" }}>
                <FileTree
                    onSelect={(path) => {
                        setSelectedFileContent("");
                        setSelectedFile(path);
                    }}
                    tree={fileTree}
                />
            </div>
            <div
                style={{ flex: "1", display: "flex", flexDirection: "column" }}
            >
                <div
                    className="playground-container"
                    style={{ flex: "1", display: "flex" }}
                >
                    <div
                        className="editor-container"
                        style={{
                            flex: "1",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div className="editor" style={{ flex: "1" }}>
                            {selectedFile && (
                                <p>
                                    {selectedFile.replaceAll("/", " > ")}{" "}
                                    {isSaved ? "Saved" : "Unsaved"}{" "}
                                </p>
                            )}
                            <AceEditor
                                mode={getFileMode({ selectedFile })}
                                theme="monokai"
                                value={code}
                                onChange={(e) => setCode(e)}
                                setOptions={{
                                    enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: true,
                                    enableSnippets: true,
                                }}
                                style={{ width: "100%", height: "100%"}}
                            />
                        </div>
                    </div>
                    <div
                        className="terminal-container"
                        style={{ flex: "0 0 auto", width: "100%" }}
                    >
                        <Terminal />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
