const mongoose=require('mongoose');

const workspaceSchema = mongoose.Schema(
    {
        Id : String ,
        FolderStructure : Object ,
    }
)

module.exports = { workspaceSchema }