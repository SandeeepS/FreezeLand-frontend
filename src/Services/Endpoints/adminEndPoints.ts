const adminRoutes = {
  login: "/admin/login",
  getAllUsers: "/admin/users",
  getAllMechanic:"/admin/mechanics",
  blockUser: "/admin/users/block/",
  blockMech:"/admin/mech/block/",
  deleteUser:"/admin/users/delete/",
  deleteMech:"/admin/mech/delete/",
  addNewService:"/admin/addNewService",
  getAllServices:"/admin/getAllServices",
  getService:"/admin/getService/",
  listUnlistServices:"/admin/listUnlistServices/",
  deleteService:"/admin/deleteService/",
  editExistService:'/admin/editExistService',
  logout: "/admin/logout",
};

export default adminRoutes;
