const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, htmlContent) => {
    try {
        // Generate a test SMTP service account from ethereal.email
        // Only needed if we don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"CSBM Admins" <admin@csbm.edu>', // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            html: htmlContent, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmail };
