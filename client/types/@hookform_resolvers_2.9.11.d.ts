// See: https://github.com/react-hook-form/resolvers/pull/527

// Upgrading to @hookform/resolves@^3 will properly fix the problem, but until
// that is an option (it is built for yup@1), manually pull the types in.

declare module "@hookform/resolvers/yup" {
  // contents of @hookform/resolvers/yup/dist/types.d.ts
  import type {
    FieldValues,
    ResolverOptions,
    ResolverResult,
  } from "react-hook-form";
  import type * as Yup from "yup";
  import type Lazy from "yup/lib/Lazy";

  // biome-ignore lint/suspicious/noExplicitAny: allowed
  declare type Options<T extends Yup.AnyObjectSchema | Lazy<any>> = Parameters<
    T["validate"]
  >[1];
  // biome-ignore lint/suspicious/noExplicitAny: allowed
  export declare type Resolver = <T extends Yup.AnyObjectSchema | Lazy<any>>(
    schema: T,
    schemaOptions?: Options<T>,
    factoryOptions?: {
      mode?: "async" | "sync";
      rawValues?: boolean;
    },
  ) => <TFieldValues extends FieldValues, TContext>(
    values: TFieldValues,
    context: TContext | undefined,
    options: ResolverOptions<TFieldValues>,
  ) => Promise<ResolverResult<TFieldValues>>;

  // contents of @hookform/resolvers/yup/dist/yup.d.ts
  export declare const yupResolver: Resolver;
}
