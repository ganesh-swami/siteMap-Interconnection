import mongoose from 'mongoose';

require('mongoose-type-url');

const topicalMapSchema = new mongoose.Schema(
  {
    origin: {
      type: String,
      required: [true, 'Please provide a URL'],
      index: true,
    },
    url: {
      type: mongoose.SchemaTypes.Url,
      required: [true, 'Please provide a URL'],
      index: true,
    },
    title:{
      type: String,
      index: true,
    },
    topicalMap: {
      type: String,
    },
    status: {
      type: String,
      enum: ['PROCESSING', 'COMPLETED', 'FAILED'],
      default: 'PROCESSING',
      index: true,
    },
    statusPercent: {
      type: Number,
      max: 100,
      default: 0,
    },
    userId: {
      type: String,
      index:true
    },
  },
  { timestamps: true }
);

const TopicalMap = mongoose.models.topicalMaps || mongoose.model('topicalMaps', topicalMapSchema);

export default TopicalMap;
