import { makeExecutableSchema } from '@graphql-tools/schema'
import Latihan from '#models/latihan'


const typeDefs = `
  enum StatusLatihan {
    terlaksana
    belum_terlaksana
  }

  enum TypeLatihan {
    cardio
    strength
    flexibility
  }

  type Latihan {
    _id: ID!
    name: String!
    type: TypeLatihan!
    duration: Int!
    date: String!
    status: StatusLatihan!
  }

  type Query {
    latihan: [Latihan!]!
    latihanById(id: ID!): Latihan
  }
`


const resolvers = {
  Query: {
    latihan: async (_: any, __: any, context: any) => {
      const { userId } = context
      return await Latihan.find({ userId }).sort({ date: 1 })
    },
    
    latihanById: async (_: any, { id }: { id: string }, context: any) => {
      const { userId } = context
      return await Latihan.findOne({ _id: id, userId })
    }
  }
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})