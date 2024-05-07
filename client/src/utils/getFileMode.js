export const getFileMode = ({ selectedFile }) => {
    const splitArray = selectedFile.split(".");
    const extension = splitArray[splitArray.length - 1];
    switch (extension) {
        case "js":
            return "javascript";
        case "py":
            return "python";
        case "java":
            return "java";
        case "c":
            return "c_cpp";
        case "cpp":
            return "c_cpp";
        case "html":
            return "html";
        case "css":
            return "css";
        case "json":
            return "json";
        case "xml":
            return "xml";
        case "sql":
            return "sql";
        case "sh":
            return "sh";
        default:
            return "";
    }
}