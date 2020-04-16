const { GraphQLServer } = require('graphql-yoga');

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args) => {
      return links.find(link => link.id === args.id)
    }
  },
  // deleted Links because you don't actually need resolvers for each of the 
  // properties of the link graphql is smart enough to figure them out
  Mutation: {
    post: (parent, args) => {

      // create new link object with parameters
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }

      // push it into the links array
      links.push(link);

      // return newly created link object
      return link;
    },
    updateLink: (parent, args) => {
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
    deleteLink: (parent, args) => {
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
  resolvers
})

server.start(() => console.log(`Server is running on http://localhost:4000`));