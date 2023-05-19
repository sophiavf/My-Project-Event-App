import { Timestamp } from '@firebase/firestore-types';
import Event from '../src/types/Event'

export const fakeEventData: Event[] = [
  {
    id: 1,
    writeTimestamp: Timestamp.now(),
    eventPlatform: 'Meetup',
    name: 'Test Event 1',
    eventLink: 'http://example.com/event1',
    dateTime: new Date(),
    location: 'Test Location 1',
    summary: 'This is a test event 1',
    image: 'http://example.com/event1.jpg',
  },
  {
    id: 2,
    writeTimestamp: Timestamp.now(),
    eventPlatform: 'Eventbrite',
    name: 'Test Event 2',
    eventLink: 'http://example.com/event2',
    dateTime: new Date(),
    location: 'Test Location 2',
    summary: 'This is a test event 2',
    image: 'http://example.com/event2.jpg',
  }
];