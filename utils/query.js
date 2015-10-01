'use strict';

var sql = {

    databaseUrl: function() {
        return process.env.DATABASE_URL || process.env.OPENSHIFT_POSTGRESQL_DB_URL;
    },

    permissions: function () {
        // Parameters:
        // 1: person.id
        return "select e.id event_id, e.name event_name " +
               "from person p " +
               "inner join event_admins ad on ad.person_id=p.id " +
               "inner join event e on e.id=ad.event_id " +
               "where user_id = $1";
    },

    updateLastLogin: function() {
        return "update person set last_login=now() where id=$1";
    },

    updatePerson: function() {
        return "update person set email=$2,firstname=$3,lastname=$4," +
               "active=$5,guest=$6,user_role=$7 where user_id=$1";
    },

    upsertPerson: function() {
        return "WITH upsert AS (" +
                "update person set email=$2,firstname=$3,lastname=$4," +
                "active=$5,guest=$6,user_role=$7, last_login=now() where user_id=$1 RETURNING *) " +
                "insert into person (user_id,email,firstname,lastname,active,guest,user_role,last_login) " +
                "select $1,$2,$3,$4,$5,$6,$7,now()" +
                "WHERE NOT EXISTS (SELECT * from upsert)";
    },

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
    },

    events: function() {
        return "select * from event where active order by name";
    },

    eventDetail: function() {
        return "select * from event where id=$1";
    },

    eventDates: function() {
        // Parameters:
        // 1: event.id
        // 2: on_date
        return "select * from event_date " +
               "where event_id = $1 and on_date >= $2 " +
               "order by on_date limit 12";
    },

    eventDate: function() {
        // Parameters:
        // 1: eventdate.id
        return "select * from event_date where id = $1";
    },

    updateEventDate: function() {
        return "update event_date set focus=$2, notes=$3, url=$4 where id = $1";
    },

    eventDateRota: function() {
        // Parameters:
        // 1: eventdate.id
        return "select ev.name event_name, ev.id event_id, on_date, " +
                "role.name role_name, firstname, lastname, role.id role_id, " +
                "    ed.id event_date_id, p.active person_active, p.id person_id, " +
                "    exists(select 1 from away_date where person_id=p.id " +
                "and on_date between from_date and to_date) is_away, " +
                "    ed.focus, ed.notes, " +
                "    exists(select 1 from rota rr " +
                "inner join event_date eded on rr.event_date_id=eded.id " +
                "where rr.person_id=p.id " +
                "and eded.id<>ed.id " +
                "and eded.on_date=ed.on_date) on_rota " +
                "from rota r " +
                "inner join event_date ed on r.event_date_id=ed.id " +
                "inner join event ev on ed.event_id=ev.id " +
                "inner join person p on r.person_id=p.id " +
                "inner join role on role.id = r.role_id " +
                "where ed.id = $1 " +
                "order by role.sequence";
    },

    eventDateRoles: function() {
        return "select r.id role_id, r.sequence, r.name role_name, firstname, lastname, " +
                "p.active person_active, p.id person_id, on_date, " +
                "    exists(select 1 from away_date where person_id=p.id " +
                "and on_date between from_date and to_date) is_away " +
                "from role r " +
                "left outer join role_people rp on rp.role_id=r.id " +
                "left outer join person p on p.id=rp.person_id " +
                "inner join event_date ed on r.event_id=ed.event_id and " +
                "ed.id = $1 " +
                "order by sequence, r.id";
    },

    rotaForRole: function() {
        // Parameters:
        // 1: eventdate.id
        // 2: role_id
        return "select * from rota where event_date_id=$1 and role_id=$2";
    },

    addRotaForRole: function() {
        return "insert into rota (event_date_id, role_id, person_id) values ($1, $2, $3)";
    },

    updateRotaForRole: function() {
        // Parameters:
        // 1: rota.id
        // 2: person_id
        return "update rota set person_id=$2 where id=$1";
    },

    deleteRotaForPerson: function() {
        return "delete from rota where id=$1";
    }

};

module.exports = sql;