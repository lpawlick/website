import React from "react";
import CryptoJS from "crypto-js";
// @ts-ignore
import Obfuscate from 'react-obfuscate';
import {Link} from "@nextui-org/react";
const secretKey = "$@!v4pqEXV4xkaxW9yGn$U5xDCZ!Q5BxZ$tVP!2!H6G3j9dm&3B@XQ4y2iiv56GD"; // Replace this with your secret key

export const ContactMeHref = () => 
{
  // Function to encrypt the email
  const encryptData = (data : string) => {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
  };

  // Function to decrypt the email
  const decryptData = (encryptedData : string) => 
  {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  // Encrypt the email
  const encryptedEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "U2FsdGVkX18AfX3T8GT1VaKJEJH6TPVUwtDGgpESMZVPBuMNgBxlHII2IXlAWMNaKcrCcMUM3RNDaoChwYB67XYs9TYL6AcdnJnQgFri4eY82wsHiJS+BlTYrY/pCGBGcrZtWx9bx3JteUt89inFKC5tWs17z4rWLeaeM3Sc0M8XNbwAQe3OE7k1o4CEZdl8";

  return (
    <div className="flex flex-row flex-wrap">
    {encryptedEmail !== "U2FsdGVkX18AfX3T8GT1VaKJEJH6TPVUwtDGgpESMZVPBuMNgBxlHII2IXlAWMNaKcrCcMUM3RNDaoChwYB67XYs9TYL6AcdnJnQgFri4eY82wsHiJS+BlTYrY/pCGBGcrZtWx9bx3JteUt89inFKC5tWs17z4rWLeaeM3Sc0M8XNbwAQe3OE7k1o4CEZdl8" ? (
      <Link isExternal showAnchorIcon>
        <Obfuscate email={decryptData(encryptedEmail)} />
      </Link>
    ) : (
      <span>{decryptData(encryptedEmail)}</span>
    )}
  </div>
  );
};

export default ContactMeHref;