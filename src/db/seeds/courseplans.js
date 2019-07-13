exports.seed = knex =>
  knex('course_plans')
    .del()
    .then(() =>
      knex('course_plans').insert([
        { plan_name: 'standard', price: 200, length_in_days: 185 },
        { plan_name: 'lite', price: 50, length_in_days: 185 },
      ])
    );
