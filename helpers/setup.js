/**
 * A module that adds CASL plugins to mongoose.
 * CASL plugins need to be added before calling
 * mongoose.model(...), as Mongoose won't add global plugins
 * to models that were created before.
 * @module helpers/setup
 * @author Andris Jansons
 */

import casl from '@casl/mongoose';
import mongoose from 'mongoose';

mongoose.plugin(casl.accessibleRecordsPlugin);
mongoose.plugin(casl.accessibleFieldsPlugin);
