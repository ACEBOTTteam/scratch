export const getSerialPort = async () => {

    return await navigator.serial.requestPort();
}