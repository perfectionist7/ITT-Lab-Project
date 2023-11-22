DELIMITER //

CREATE PROCEDURE UpdateDoctorPassword(
    IN p_email VARCHAR(50),
    IN p_oldPassword VARCHAR(30),
    IN p_newPassword VARCHAR(30)
)
BEGIN
    UPDATE DoctorInfo 
    SET password = p_newPassword
    WHERE email = p_email
    AND password = p_oldPassword;
END //

DELIMITER ;
