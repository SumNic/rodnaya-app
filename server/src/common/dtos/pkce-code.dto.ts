import { ApiProperty } from '@nestjs/swagger';

export class PkceCode {
    @ApiProperty({
        example: 'sdfsdf',
        description: 'code_verifier',
    })
    code_verifier: string;

    @ApiProperty({
        example: 'aksjwelWe4kjldfksjas',
        description: 'code_challenge',
    })
    code_challenge: string;

    @ApiProperty({
        example: 'aksjwelWe4kjldfksjas',
        description: 'random string',
    })
    state: string;
}
