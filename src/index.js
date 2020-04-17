const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');

// removed links array and linkId because we're moving to a real db!

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
      return context.prisma.links()
    },
    link: (parent, args) => {
      return links.find(link => link.id === args.id)
    }
  },
  Mutation: {
    post: (parent, args, context, info) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description
      })
    },
    updateLink: (parent, args,  context, info) => {
      const { id, description, url } = args;

      // find the matching link by matching link's id, get its position in the array
      const linkIndex = links.findIndex(link => link.id === args.id);

      // if we get a position
      if (linkIndex !== -1) {

        // create new link object
        const updatedLink = {
          id,
          description,
          url
        }

        // use fetched position to update the link object
        links[linkIndex] = updatedLink

        // return new link object
        return updatedLink;
      }

      // can't find link, returning null
      return null;
    },
    deleteLink: (parent, args,  context, info) => {
      const foundLink = links.find(link => link.id === args.id);

      if (foundLink) {
        const filteredLinks = links.filter(link => link.id !== args.id)

        links = filteredLinks;

        return foundLink;
      }

      return null;
    }
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma }
})

server.start(() => console.log(`Server is running on http://localhost:4000`));