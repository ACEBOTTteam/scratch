export default function (Blockly) {
    //这是一个新增积木块
    Blockly.Blocks['newBlock'] = {
        init: function () { 
            this.jsonInit({
                "message0":"这是一个新增的积木块",
                "args0":[],
                "category":Blockly.Categories.addBlocks,
                "extensions": ["colours_control", "shape_hat"]
            })       
        }

    }

    //向前
    Blockly.Blocks['forword11'] = {
        init:function(){
            this.jsonInit({
                "message0":"以每秒 %1 的速度向前移动",
                "args0":[
                    {
                        "type":"input_value",
                        "name":"SPEED"
                    }
                ],
                "category":Blockly.Categories.addBlocks,
                "extensions": ["colours_control", "shape_statement"]
            })
        }
    }

    //转向
    Blockly.Blocks['veer'] = {
        init: function(){
            this.jsonInit({
                "message0":"向%1转向打发十分士大夫士大夫电风扇发射点发顺丰十大",
                "args0":[
                    {
                        "type":"field_dropdown",
                        "name":"veerType",
                        "options":[
                            ["左","_left_"],
                            ["右","_right_"]
                        ]
                    }
                ],
                "category":Blockly.Categories.addBlocks,
                "extensions": ["colours_control", "shape_statement"]
            })
        }
    }
}