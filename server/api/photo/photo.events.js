/**
 * Photo model events
 */

'use strict';

import {EventEmitter} from 'events';
import Photo from './photo.model';
var PhotoEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PhotoEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Photo.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PhotoEvents.emit(event + ':' + doc._id, doc);
    PhotoEvents.emit(event, doc);
  };
}

export default PhotoEvents;
