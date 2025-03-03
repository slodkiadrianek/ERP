import mongoose from "mongoose";

export class Db {
  private dbLink: string;
  constructor(dbLink: string) {
    this.dbLink = dbLink;
    this.initializeConnections();
  }

  protected async initializeConnections(): Promise<void> {
    try {
      if (this.dbLink) {
        await mongoose.connect(this.dbLink);
        console.log(`Database connected `);
      } else {
        throw new Error("You have to specifie db link");
      }
    } catch (error) {
      console.error(error);
    }
  }
}
