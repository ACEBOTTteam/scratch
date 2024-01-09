export default function (Blockly) {
    Blockly.Python = new Blockly.Generator('Python');
    Blockly.Python['flicker'] = function (block) {
        return `
void setup() {
     pinMode(02, OUTPUT); //INPUT
}
void loop() {
    digitalWrite(2, HIGH);  //the blue indicator lights up
    delay(3000);
    digitalWrite(2, LOW);
    delay(1000);
}`
    };

    Blockly.Python['veer'] = function (block) {
        let numberList = block.getFieldValue('numberList')
        let numberType = block.getFieldValue('numberType')
        // var steps = Blockly.Python.valueToCode(block, "STEPS", Blockly.Python.ORDER_NONE);
        // return 'move ' + steps + ' steps\n';
        return `A2 ${numberList} ${numberType}\r\n`
    };

}
