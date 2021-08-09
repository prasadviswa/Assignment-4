const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
require('./database');
const Task = require('./module');

const init = async () => {
  const server = new Hapi.Server({
    port: 5000,
    host: 'localhost',
  });

  server.route({
    method: 'POST',
    path: '/post',
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().min(5).required(),
          phone: Joi.number().min(10).required(),
          age: Joi.number().max(105).required(),
          email: Joi.string().email({ tlds: { allow: false } }),
        }),
        failAction: (request, response, error) => {
          return error.isJoi
            ? response.response(error.details[0]).takeover()
            : response.response(error).takeover();
        },
      },
    },
    handler: async (request, response) => {
      try {
        const task = new Task(request.payload);
        const taskSaved = await task.save();
        return response.response(taskSaved);
      } catch (error) {
        return response.response(error).code(500);
      }
    },
  });

  server.route({
    method: 'GET',
    path: '/get',
    handler: async (request, response) => {
      try {
        const tasks = await Task.find();
        return response.response(tasks);
      } catch (error) {
        return response.response(error).code(500);
      }
    },
  });

  server.route({
    method: 'GET',
    path: '/get/{id}',
    handler: async (request, response) => {
      try {
        const task = await Task.findById(request.params.id);
        return response.response(task);
      } catch (error) {
        return response.response(error).code(500);
      }
    },
  });

  server.route({
    method: 'PUT',
    path: '/put/{id}',
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().min(5).required(),
          phone: Joi.number().min(10).required(),
          age: Joi.number().max(105).required(),
          email: Joi.string().email({ tlds: { allow: false } }),
        }),
        failAction: (request, response, error) => {
          return error.isJoi
            ? response.response(error.details[0]).takeover()
            : response.response(error).takeover();
        },
      },
    },
    handler: async (request, response) => {
      try {
        const updatedTask = await Task.findByIdAndUpdate(
          request.params.id,
          request.payload,
          {
            new: true,
          }
        );
        return response.response(updatedTask);
      } catch (error) {
        return response.response(error).code(500);
      }
    },
  });

  server.route({
    method: 'DELETE',
    path: '/delete/{id}',
    handler: async (request, response) => {
      try {
        const deletedTask = await Task.findByIdAndDelete(request.params.id);
        return response.response(deletedTask);
      } catch (error) {
        return response.response(error).code(500);
      }
    },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
