DROP PROCEDURE IF EXISTS InsertPatientInfo;

DELIMITER //

CREATE PROCEDURE InsertPatientInfo(
    IN p_email VARCHAR(50),
    IN p_password VARCHAR(30),
    IN p_name VARCHAR(50),
    IN p_address VARCHAR(60),
    IN p_gender VARCHAR(10)
)
BEGIN
    INSERT INTO PatientInfo (email, password, name, address, gender)
    VALUES (p_email, p_password, p_name, p_address, p_gender);
END //

DELIMITER ;
