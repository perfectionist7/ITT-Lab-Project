DELIMITER //

CREATE TRIGGER PatientInfo_AfterInsert
AFTER INSERT ON PatientInfo
FOR EACH ROW
BEGIN
    DECLARE email_exists INT;

    SELECT COUNT(*) INTO email_exists FROM PatientLoginDetails WHERE email = NEW.email;

    IF email_exists > 0 THEN
        UPDATE PatientLoginDetails
        SET account_creation_date = CURRENT_TIMESTAMP()
        WHERE email = NEW.email;
    ELSE
        INSERT INTO PatientLoginDetails (email, account_creation_date)
        VALUES (NEW.email, CURRENT_TIMESTAMP());
    END IF;
END //

DELIMITER ;