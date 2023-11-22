DELIMITER //

CREATE TRIGGER DoctorInfo_AfterInsert
AFTER INSERT ON DoctorInfo
FOR EACH ROW
BEGIN
    DECLARE email_exists INT;

    SELECT COUNT(*) INTO email_exists FROM DoctorLoginDetails WHERE email = NEW.email;

    IF email_exists > 0 THEN
        UPDATE DoctorLoginDetails
        SET account_creation_date = CURRENT_TIMESTAMP()
        WHERE email = NEW.email;
    ELSE
        INSERT INTO DoctorLoginDetails (email, account_creation_date)
        VALUES (NEW.email, CURRENT_TIMESTAMP());
    END IF;
END //

DELIMITER ;
