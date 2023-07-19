import * as React from "react";

export interface IContactMeHrefProps {}

const email = process.env.CONTACT_EMAIL;

export const ContactMeHref: React.FC<IContactMeHrefProps> = props => 
{
  return (
    <div>
        {email}
    </div>
  );
};

export default ContactMeHref;