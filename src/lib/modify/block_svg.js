import addBlock from './blocks/addBlock/shape'
import codeGeneration from './codeGeneration'

export default function (Blockly) {
    addBlock(Blockly)
    codeGeneration(Blockly)
    console.log(Blockly,'Blockly')
    Blockly.BlockSvg.prototype.showContextMenu_ = function (e) {
        if (this.workspace.options.readOnly || !this.contextMenu) {
            return;
        }
        // Save the current block in a variable for use in closures.
        var block = this;
        var menuOptions = [];
        if (this.isDeletable() && this.isMovable() && !block.isInFlyout) {
            menuOptions.push(
                Blockly.ContextMenu.blockDuplicateOption(block, e));
            if (this.isEditable() && this.workspace.options.comments) {
                menuOptions.push(Blockly.ContextMenu.blockCommentOption(block));
            }
            menuOptions.push(Blockly.ContextMenu.blockDeleteOption(block));
        } else if (this.parentBlock_ && this.isShadow_) {
            this.parentBlock_.showContextMenu_(e);
            return;
        }

        // Allow the block to add or modify menuOptions.
        if (this.customContextMenu) {
            this.customContextMenu(menuOptions);
        }
        Blockly.ContextMenu.show(e, menuOptions, this.RTL);
        Blockly.ContextMenu.currentBlock = this;
    };

}