import { RequestHandler } from 'express';

import tryCatch from '../helpers/tryCatch';

import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import validateFields from '../middleware/validateFields';

import roleService from '../services/role.service';

const getRole: RequestHandler[] = [
  authenticate,
  authorize.server('manageRoles'),
  tryCatch(
    async (req, res) => {
      const { serverId, roleId } = req.params

      const role = await roleService.get(serverId, roleId);

      res.json({ data: role });
    }
  )
];

const getRoles: RequestHandler[] = [
  authenticate,
  authorize.server('manageRoles'),
  tryCatch(
    async (req, res) => {
      const roles = await roleService.get(req.params.serverId);

      res.json({ data: roles });
    }
  )
];

const createRole: RequestHandler[] = [
  ...validateFields(['roleName', 'color']),
  authenticate,
  authorize.server('manageRoles'),
  tryCatch(
    async (req, res) => {
      const role = await roleService.create(req.params.serverId, req.body);

      res.json({
        data: role,
        message: 'Role created successfully.',
      });
    }
  )
];

const updateRole: RequestHandler[] = [
  ...validateFields(['roleName', 'color']),
  authenticate,
  authorize.server('manageRoles'),
  tryCatch(
    async (req, res) => {
      const { serverId, roleId } = req.params;

      const role = await roleService.update(serverId, roleId, req.body);

      res.json({
        data: role,
        message: 'Role updated successfully.',
      });
    }
  )
];

const deleteRole: RequestHandler[] = [
  authenticate,
  authorize.server('manageRoles'),
  tryCatch(
    async (req, res) => {
      const { serverId, roleId } = req.params;

      const role = await roleService.remove(serverId, roleId);

      res.json({
        data: role,
        message: 'Role deleted successfully.',
      });
    }
  )
];

export default {
  getRole,
  getRoles,
  createRole,
  updateRole,
  deleteRole,
};