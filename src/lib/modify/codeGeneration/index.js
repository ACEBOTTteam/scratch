export default function (Blockly){
    Blockly.Python = new Blockly.Generator('Python');
    console.log(Blockly,'Blockly')
    Blockly.Python['newBlock'] = function (block) {
        console.log(block,'积木块信息')
        // var steps = Blockly.Python.valueToCode(block, "STEPS", Blockly.Python.ORDER_NONE);
        // return 'move ' + steps + ' steps\n';
        return `2222`
    };
}
