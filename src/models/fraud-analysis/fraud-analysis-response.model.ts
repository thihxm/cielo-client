import type { EnumFraudAnalysisStatus } from "../../enums";
import type { ReplyDataResponseModel } from "./replay-data.model";

export interface FraudAnalysisResponseModel {
    id: string;
    status: EnumFraudAnalysisStatus;
    fraudAnalysisReasonCode: number;
    replyData: ReplyDataResponseModel;
}
