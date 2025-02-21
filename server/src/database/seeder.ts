import { Database } from "sqlite3";

export function testSeedDatabase(db: Database): void {
  db.serialize(() => {
    console.log("Seeding database...");

    db.run(
      `INSERT INTO Events (title, coordinator, description) VALUES 
        ('Tech Conference', 'John Doe', 'An event about new technology trends.'),
        ('Startup Meetup', 'Jane Smith', 'Networking event for startups.'),
        ('AI Workshop', 'Alice Johnson', 'Workshop on Artificial Intelligence.')`
    );

    db.run(
      `INSERT INTO Files (name, path) VALUES 
        ('presentation.pdf', '/files/presentation.pdf'),
        ('schedule.docx', '/files/schedule.docx'),
        ('brochure.png', '/files/brochure.png')`
    );

    db.run(
      `INSERT INTO EventFiles (event_id, file_id) VALUES 
        (1, 1),
        (1, 2),
        (2, 3)`
    );

    console.log("Seeding completed.");
  });
}
