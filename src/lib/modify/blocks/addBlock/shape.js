export default function (Blockly) {
    //这是一个新增积木块
    Blockly.Blocks['flicker'] = {
        init: function () {
            this.jsonInit({
                "message0": "控制灯光闪烁",
                "args0": [],
                "category": Blockly.Categories.addBlocks,
                // "extensions": ["colours_control", "shape_hat"]
                "extensions": ["colours_control", "shape_statement"]
            })
        }

    }

    //向前
    Blockly.Blocks['forword11'] = {
        init: function () {
            this.jsonInit({
                "message0": "以每秒 %1 的速度向前移动",
                "args0": [
                    {
                        "type": "input_value",
                        "name": "SPEED"
                    }
                ],
                "category": Blockly.Categories.addBlocks,
                "extensions": ["colours_control", "shape_statement"]
            })
        }
    }

    //切换串口的高低平
    Blockly.Blocks['veer'] = {
        init: function () {
            this.jsonInit({
                "message0": "设置数字引脚%1输出为%2",
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "numberList",
                        "options": [
                            ["1", "1"],
                            ["2", "2"],
                            ["3", "3"],
                            ["4", "4"],
                            ["5", "5"],
                            ["6", "6"],
                            ["7", "7"],
                            ["8", "8"],
                            ["9", "9"],
                            ["10", "10"],
                            ["11", "11"],
                            ["12", "12"],
                            ["13", "13"],
                            ["14", "14"],
                            ["15", "15"],
                            ["16", "16"],
                            ["17", "17"],
                            ["18", "18"],
                            ["19", "19"],
                            ["20", "20"],
                            ["21", "21"],
                        ]
                    },
                    {
                        "type": "field_dropdown",
                        "name": "numberType",
                        "options": [
                            ["高电平", "1"],
                            ["低电平", "0"]
                        ]
                    }
                ],
                "category": Blockly.Categories.addBlocks,
                "extensions": ["colours_control", "shape_statement"]
            })
        }
    }
}