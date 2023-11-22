DELIMITER //

CREATE PROCEDURE GetMedHistView(
    IN p_email_in_use VARCHAR(50),
    IN p_name VARCHAR(50)
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE patient_email VARCHAR(50);

    DECLARE patient_cursor CURSOR FOR
        SELECT DISTINCT p.email
        FROM PatientAppointments p
        JOIN Diagnosis d ON p.id = d.id
        WHERE d.email = p_email_in_use;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN patient_cursor;

    patient_loop: LOOP
        FETCH patient_cursor INTO patient_email;
        IF done THEN
            LEAVE patient_loop;
        END IF;

        SELECT DISTINCT
            PatientInfo.name AS 'Name',
            PatientRecords.id AS 'ID',
            PatientInfo.email
        FROM PatientInfo
        JOIN PatientRecords ON PatientInfo.email = PatientRecords.email
        WHERE PatientInfo.email = patient_email
        AND (p_name = '' OR PatientInfo.name LIKE CONCAT('%', p_name, '%'));
    END LOOP;

    CLOSE patient_cursor;
END //

DELIMITER ;
