import got from 'got';
import { CliCommandInterface } from './cli-comand.interface.js';
import { MockData } from '../shared/types/mock-data.type.js';
import { OfferGenerator } from '../offer-generator/offer-generator.js';
import TSVFileWriter from '../shared/libs/file-writer/tsv-file-writer.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      console.log(`Can't load data from ${url}.`);
    }

    const offerGeneratorString = new OfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);
    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(offerGeneratorString.generate());
    }
    console.log(`File ${filepath} was created!`);
  }
}
