const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Shows = require('../models/show')
// const Date = require('../public/date')

const WatchbagSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    // image: {
    //     type: File,
    // },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    description: String,
    lastUpdated: {
        type: Date,
        default: Date.now()
    },
    // author: { type: Schema.Types.ObjectId, ref: 'User' },
    showsCurrent: [{ type: Schema.Types.ObjectId, ref: 'Show' }],
    showsWatched: [{ type: Schema.Types.ObjectId, ref: 'Show' }],
    showsPlanned: [{ type: Schema.Types.ObjectId, ref: 'Show' }],
    showsOnHold: [{ type: Schema.Types.ObjectId, ref: 'Show' }]
});

WatchbagSchema.post('findOneAndDelete', async function (data) {
    if( data ){
        await Shows.deleteMany( { _id: { $in : data.showsCurrent } } )
        await Shows.deleteMany( { _id: { $in : data.showsDropped } } )
        await Shows.deleteMany( { _id: { $in : data.showsOnHold } } )
        await Shows.deleteMany( { _id: { $in : data.showsWatched } } )
    }
} )

module.exports = mongoose.model('Watchbag', WatchbagSchema);