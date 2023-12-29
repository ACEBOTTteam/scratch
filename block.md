### block的几种field

| 属性名         | 注释     |
| -------------- | -------- |
| field_checkbox | 勾选框   |
| field_dropdown | 下拉列表 |
| field_colour   | 颜色     |
| field_angle    | 角度     |
| field_date     | 日期     |
| field_label    | 标签文本 |
| field_image    | 图片文本 |

### block的集中input


| 属性名          | 注释                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------ |
| input_value     | 可被相同形状的积木覆盖的参数，根据 "check": "Boolean", "String", "Number" 的不同，形状不同 |
| input_statement | 可以连接命令类型积木                                                                       |


### 自定义block

```js
    // 将 control_if 添加到 ScratchBlocks.Blocks 对象中，这个对象包含了所有积木的定义
Blockly.Blocks['control_if'] = {
  /**
   * Block for if-then.
   * @this Blockly.Block
   */
  // 积木初始化时调用的方法
  init: function() {
    // 积木的 json 配置
    this.jsonInit({
      "type": "control_if",  // 积木标识符 名字
      "message0": Blockly.Msg.CONTROL_IF, 积木的文案
      "message1": "%1", // Statement ，1% 是参数占位符，和 args0 数组中参数对应
      // 积木的参数，必须是数组，可以为空数组
      "args0": [
        {
 
          // 需要在 xml 中指明 shadow block 的 type
          "type": "input_value", // 类型 有 input_value field_dropdown .... 
          "name": "CONDITION", // 名字
          "check": "Boolean" // 返回类型
        }
      ],
      "args1": [
        {
          "type": "input_statement",
          "name": "SUBSTACK"
        }
      ],
       // 积木所属的分类，对应 xml 中 category 标签的 id
      "category": Blockly.Categories.control, // 属于类别
      // 积木继承项，数组中的字符串是已经定义好的扩展，使用扩展属性可以减少重复的配置
      // 可以在 ScratchBlocks.Extensions 对象中查看所有定义的扩展，也可以自己定义扩展。
      // colours_control 表示 motion 积木的颜色
      // shape_statement 表示积木的形状
      "extensions": ["colours_control", "shape_statement"] // 颜色 与积木类型
    });
  }
};

```