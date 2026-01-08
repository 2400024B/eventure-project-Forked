// Import fs promises and the function to test
const fs = require('fs').promises;
const { deleteEvent } = require('../utils/MikealLeowUtil');

// Mock the fs module so we don't touch real files
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

describe('Backend Unit Tests - Delete Event', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Case 1: Successful deletion
  test('delete event when valid ID is provided', async () => {
    const mockEvents = JSON.stringify([
      { id: 1, name: 'Test Event' },
      { id: 2, name: 'Another Event' }
    ]);

    fs.readFile.mockResolvedValue(mockEvents);
    fs.writeFile.mockResolvedValue();

    const result = await deleteEvent(1);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Event deleted successfully.');
    expect(fs.writeFile).toHaveBeenCalled();
  });

  // Test Case 2: Event not found
  test('return error when event ID is not found', async () => {
    const mockEvents = JSON.stringify([
      { id: 1, name: 'Test Event' }
    ]);

    fs.readFile.mockResolvedValue(mockEvents);

    const result = await deleteEvent(99);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Event not found.');
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  // Test Case 3: Invalid events data structure
  test('return error when events data is invalid', async () => {
    // events.json is not an array
    fs.readFile.mockResolvedValue(JSON.stringify({ invalid: true }));

    const result = await deleteEvent(1);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid events data.');
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  // Test Case 4: File read failure
  test('return server error when file cannot be read', async () => {
    fs.readFile.mockRejectedValue(new Error('File read error'));

    const result = await deleteEvent(1);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Internal Server Error.');
  });
});
