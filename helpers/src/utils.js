const sortBy = (list, property = 'username') => (
  list.map(( user ) => user[property]).sort()
)

module.exports = {
  sortBy
}
