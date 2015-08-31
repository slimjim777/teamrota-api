
var sql = {

    rotaForPerson: function() {
        // Parameters:
        // 1: person.id
        // 2: from_date
        // 3: to_date
        return "select ev.name event_name, ev.id event_id, on_date," +
                "role.name role_name, firstname, lastname, role.id role_id," +
                "ed.id event_date_id, p.active person_active, p.id person_id," +
                "r.id, exists(select 1 from away_date where person_id=p.id " +
                "and on_date between from_date and to_date) is_away " +
                "from rota r " +
                "inner join event_date ed on r.event_date_id=ed.id " +
                "inner join event ev on ed.event_id=ev.id " +
                "inner join person p on r.person_id=p.id " +
                "inner join role on role.id = r.role_id " +
                "where p.id = $1 " +
                "and ed.on_date between $2 and $3 " +
                "order by ed.on_date, ev.name";
    },

    awayDateForPerson: function() {
        // Parameters:
        // 1: person.id
        // 2: from_date
        // 3: to_date
        return "select * from away_date " +
                "where person_id = $1 " +
                "and from_date >= $2 " +
                "and from_date < $3";
    }
};

module.exports = sql;