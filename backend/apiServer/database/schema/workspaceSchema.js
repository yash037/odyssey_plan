const mongoose=require('mongoose');

const workspaceSchema = mongoose.Schema(
    {
        Id : String ,
        folderStructure : String ,
    }
)

module.exports = { workspaceSchema }