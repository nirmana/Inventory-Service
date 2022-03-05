import { Resource } from "../types/enum/userAction";
const AccessControl = require("accesscontrol");

const grants = {
  Admin: {
    User: {
      "create:any": ["*"],
      "read:any": ["*"],
      "update:any": ["*"],
      "delete:any": ["*"],
    },
    Incident: {
      "create:any": ["*"],
      "read:any": ["*"],
      "update:any": ["*"],
      "delete:any": ["*"],
    },
  },
  User: {
    User: {
      "read:own": ["*"],
    },
    Incident: {
      "read:any": ["*"],
      "update:any": ["*"],
    },
  },
};
const ac = new AccessControl(grants);

export const roleBasedAuthorize = (resource: Resource, action: string) => {
  return (req: any, res: any, next: any) => {
    try {
      const permission = ac.can(req.user.role)[action](resource);
      if (permission.granted) {
        next();
      } else {
        res.status(403).end();
      }
    } catch (error) {
      res.status(403).end();
    }
  };
};
