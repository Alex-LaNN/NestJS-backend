import { Injectable } from '@nestjs/common'
import { SwapiEndpoints, localUrl, swapiUrl } from './shared/utils'

@Injectable()
export class AppService {
  /**
   * Функция для получения информации о доступных ресурсах SWAPI
   * @returns Объект 'SwapiEndpoints', содержащий ссылки на все доступные ресурсы
   */
  async getRootResource(): Promise<SwapiEndpoints> {
    // Запрос к 'API SWAPI' для получения данных о всех доступных ресурсах.
    const response: Response = await fetch(`${swapiUrl}`)
    const jsonResponse: SwapiEndpoints = await response.json()
    // Замена части URL-адреса в каждом свойстве объекта
    Object.keys(jsonResponse).forEach((key) => {
      jsonResponse[key] = jsonResponse[key].replace(swapiUrl, localUrl)
    })
    return jsonResponse
  }
}
