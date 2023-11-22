DELIMITER //

CREATE PROCEDURE DiagnoseAppointment(id_param INT, diagnosis_param VARCHAR(255), prescription_param VARCHAR(255))
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE appointment_id INT;
    
    DECLARE cur CURSOR FOR
        SELECT id
        FROM Diagnosis
        WHERE id = id_param;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    FETCH cur INTO appointment_id;

    IF NOT done THEN
        UPDATE Diagnosis SET diagnosis = diagnosis_param, prescription = prescription_param WHERE id = appointment_id;
        UPDATE AppointmentSchedule SET status = 'Done' WHERE id = appointment_id;
    END IF;

    CLOSE cur;
END //

DELIMITER ;
