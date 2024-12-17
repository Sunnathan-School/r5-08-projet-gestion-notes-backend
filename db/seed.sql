-- Mot de passe: password123
INSERT INTO professors (
    first_name,
    last_name,
    email,
    department,
    password_hash
) VALUES (
    'John',
    'Doe',
    'prof@example.com',
    'Informatique',
    '$2a$10$rN/uXdoptbcyxYNIr20pOOrhlF9uMmc27eM7/IfmBHx1gUEDLDTD.'
);
