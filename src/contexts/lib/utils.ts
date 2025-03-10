import * as argon2 from 'argon2';

export class Utils {
  public static async hashString(str: string): Promise<string> {
    const hash = await argon2.hash(str);

    return hash;
  }

  public static async compareHashedString(
    str: string,
    hash: string
  ): Promise<boolean> {
    const isMatch = await argon2.verify(hash, str);

    return isMatch;
  }

  public static upperFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
