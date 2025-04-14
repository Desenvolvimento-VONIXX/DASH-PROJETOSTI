export const hexToAscii = (hexStr: string) => {
    hexStr = hexStr.replace(/\s/g, "");
    if (hexStr.length % 2 !== 0) {
        console.error("String hexadecimal inválida.");
        return "";
    }
    return hexStr.match(/.{1,2}/g)?.map((byte) => String.fromCharCode(parseInt(byte, 16))).join("") || "";
};