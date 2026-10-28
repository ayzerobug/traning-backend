export const resetPasswordEmailTemplate = (name, resetLink) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Reset your password</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      * { font-family: 'Inter', Arial, sans-serif; }
      @media (max-width:600px) {
        .mobile_mt-0 { margin-top:0 !important; }
        .mobile_px-2 { padding-left:0.5rem !important; padding-right:0.5rem !important; }
        .mobile_px-6 { padding-left:1.5rem !important; padding-right:1.5rem !important; }
        .mobile_py-12 { padding-top:3rem !important; padding-bottom:3rem !important; }
      }
    </style>
  </head>
  <body style="background-color:rgb(243,244,246);margin:0">
    <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
      Reset your Yangaplug Training password
    </div>
    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
      <tr>
        <td style="background-color:rgb(243,244,246);text-align:center">
          <table class="mobile_mt-0" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
            style="max-width:640px;margin:2rem auto 0;width:100%;background-color:rgb(255,255,255)">
            <tr>
              <td class="mobile_px-2" style="padding:1rem 1.5rem">
                <p style="font-size:13px;line-height:1.5;color:rgb(123,125,129);margin:0 0 0.75rem;padding:7px 1.5rem;text-align:right">
                  Yangaplug Training
                </p>
                <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                  style="background-color:rgb(243,244,246);border-radius:8px;text-align:center">
                  <tr>
                    <td class="mobile_px-6 mobile_py-12" style="padding:64px 40px">
                      <h1 style="font-size:28px;font-weight:600;line-height:1.3;color:rgb(20,23,30);margin:0 0 0.75rem">
                        Reset your password
                      </h1>
                      <p style="font-size:16px;line-height:1.5;color:rgb(67,69,75);margin:0 auto 2rem;max-width:380px">
                        Hi ${name}, we received a request to reset your password. Use the button below to choose a new one.
                      </p>
                      <a href="${resetLink}" target="_blank"
                        style="display:inline-block;background-color:rgb(20,23,30);color:rgb(255,255,255);font-size:16px;line-height:1.2;text-decoration:none;border-radius:0.5rem;padding:16px 28px">
                        Change password
                      </a>
                      <p style="font-size:13px;line-height:1.5;color:rgb(123,125,129);margin:2rem auto 0;max-width:400px">
                        If you didn't request this, ignore this email. Your password won't change until you open the link above and create a new one.
                      </p>
                    </td>
                  </tr>
                </table>
                <p style="font-size:11px;line-height:1.5;color:rgb(123,125,129);margin:0;padding:2.5rem 1.5rem;text-align:center">
                  &copy; Yangaplug Training
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
