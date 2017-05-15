/**
 * Lot model events
 */

'use strict';

import {EventEmitter} from 'events';
import Lot from './lot.model';
var LotEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
LotEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Lot.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    LotEvents.emit(event + ':' + doc._id, doc);
    LotEvents.emit(event, doc);
  };
}

export default LotEvents;
