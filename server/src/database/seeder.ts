import { Database } from 'sqlite3';

export function testSeedDatabase(db: Database): void {
  db.serialize(() => {
    console.log('Seeding database...');

    const handleError = (err: Error | null, message: string) => {
      if (err) {
        console.error(`Error: ${message}`, err);
      } else {
        console.log(`${message}.`);
      }
    };

    db.run(
      `INSERT INTO Events (title, coordinator, description, start) VALUES
        ('Tech Conference', 'John Doe', 'An event about new technology trends.', '2025-03-01 09:00:00'),
        ('Startup Meetup', 'Jane Smith', 'Networking event for startups.', '2025-03-15 18:00:00'),
        ('AI Workshop', 'Alice Johnson', 'Workshop on Artificial Intelligence.', '2025-04-10 10:00:00'),
        ('One Time Event', 'Alice Johnson, Jane Smith', 'Cool Event.', '2025-05-20 14:30:00')`,
      (err: Error | null) => handleError(err, 'Inserted test Events'),
    );

    db.run(
      `INSERT INTO Files (name, path) VALUES
        ('presentation.pdf', '/files/presentation.pdf'),
        ('schedule.docx', '/files/schedule.docx'),
        ('brochure.png', '/files/brochure.png')`,
      (err: Error | null) => handleError(err, 'Inserted test Files'),
    );

    db.run(
      `INSERT INTO EventFiles (event_id, file_id) VALUES
        (1, 1),
        (1, 2),
        (2, 3)`,
      (err: Error | null) => handleError(err, 'Inserted test EventFiles'),
    );

    db.run(
      `INSERT INTO RepeatableEvents (from_date, to_date, event_id) VALUES
        ('2025-02-25', '2025-03-25', 1),
        ('2025-03-10', '2025-03-27', 2),
        ('2025-02-10', '2025-08-30', 3)`,
      (err: Error | null) => handleError(err, 'Inserted test RepeatableEvents'),
    );

    console.log('Seeding completed.');
  });
}
