import "reflect-metadata";

import { container } from "tsyringe";

import { api } from "@/core/config/axios";
import { DI_TOKENS } from "@/core/di/tokens";
import { IUserRepository } from "@/user/application/ports/outbound/UserRepository";
import { IContactRepository } from "@/contacts/application/ports/outbound/ContactRepository";
import { ApiUserRepository } from "@/user/adapters/outbound/api/repositories/ApiUserRepository";
import { ContactRepository } from "@/contacts/adapters/outbound/repositories/ContactRepository";

container.register(DI_TOKENS.AxiosInstance, {
  useValue: api,
});

container.register<IUserRepository>(DI_TOKENS.AuthRepository, {
  useValue: new ApiUserRepository(),
});

container.register<IContactRepository>(DI_TOKENS.ContactRepository, {
  useValue: new ContactRepository(api),
});

export { container };
